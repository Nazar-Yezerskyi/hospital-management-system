import { MailerService } from '@nestjs-modules/mailer';
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentService } from 'src/appointment/appointment.service';
import { PaymentMethodEnum } from 'src/enums/payment-method.emun';
import { PaymentStatus } from 'src/enums/payment-status.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';
@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => AppointmentService))
    private appointmentService: AppointmentService,
    private mailerService: MailerService
  ){
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    //@ts-ignore
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-04-30.basil'
    })
  }
  getStripe(){
    return this.stripe
  }
  async createPaymentData(amount: number, paymentMethod: string, appointmentId: number, paymentIntentId?:string, status?: string){
    const createPayment = await this.prisma.payment.create({
      data:{
        amount,
        currency: 'usd',
        paymentMethod,
        appointmentId,
        paymentIntentId,
        status,
      }
    })
    return createPayment
  }

  async createPaymentIntent(amount: number, appointmentId: number, paymentMethod: string, successUrl?: string){
    const findAppointment = await this.appointmentService.findAppointmentById(appointmentId)
    if(!findAppointment){
      throw new NotFoundException('Appointment not found')
    }
    if(findAppointment.referralId !== null){
      const paymentData = await this.createPaymentData(0, "referral",appointmentId)  
      return paymentData
    }
    if(paymentMethod === PaymentMethodEnum.CARD){
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'usd',
        metadata:{
          appointmentId: appointmentId.toString()
        }
      })
      const paymentData = await this.createPaymentData(amount, paymentMethod,appointmentId,paymentIntent.id,paymentIntent.status)  
      const createCheckOutSession = await this.createCheckoutSession(paymentData.paymentIntentId, findAppointment.service.name, successUrl)
      await this.mailerService.sendMail({
        to: findAppointment.patient.email,
        subject: `Paying for your appointment, appointment id: ${paymentData.appointmentId}`,
        text:`Click this url and pay: ${createCheckOutSession.url}`
      })
      return {
        clientSecreate: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        checkoutUrl: createCheckOutSession.url 
      }
    }
    if( paymentMethod === PaymentMethodEnum.CASH){
      const paymentData = await this.createPaymentData(amount, paymentMethod,appointmentId) 
      await this.mailerService.sendMail({
        to: findAppointment.patient.email,
        subject: `Payment information`,
        text:`You will need to pay be cash for services ${paymentData.amount} ${paymentData.currency} - during your next visit`
      }) 
    }
  }
  async createCheckoutSession(paymentIntentId: string, serviceName: string, successUrl?: string ) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    if (!paymentIntent) {
        throw new Error('PaymentIntent not found');
    }
    const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: paymentIntent.currency,
                    product_data: {
                        name: serviceName,
                    },
                    unit_amount: paymentIntent.amount,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        payment_intent_data:{
          metadata:{
              paymentIntentId
          }
        },
        success_url: successUrl,
          cancel_url: `https://example.com/cancel?payment_intent=${paymentIntentId}`,
          metadata: {
              paymentIntentId: paymentIntentId,
          },
      });
  
      return { sessionId: session.id, url: session.url };
  }

  async handleWebhook(body: any, sig: string) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
        event = this.stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
        throw new Error('Webhook signature verification failed');
    }

    return event;
  }

  async findRecordByPaymentIntent(paymentIntentId: string){
    const find = await this.prisma.payment.findFirst({
      where:{
        paymentIntentId
      },
      include:{
        appointment: {
          include:{ 
            patient: true
          }
        }
      }
    })
    return find;
  }

  async updatePaymentStatus(paymentId: string, status: string, receipt: string){
    const findRecord = await this.findRecordByPaymentIntent(paymentId)
    if(!findRecord){
      throw new NotFoundException('Record not found')
    }
    const updateStatus = await this.prisma.payment.update({
      where:{
        id: findRecord.id
      },
      data:{
        status
      }
    })
    if( status === PaymentStatus.SUCCEEDED){
        console.log(findRecord.id)
        await this.sendPaymentReceipt(receipt, findRecord.appointment.patient.email)
    }
    return updateStatus
  }
   async sendPaymentReceipt(receipt: string, userEmail:string){
    await this.mailerService.sendMail({
        to: userEmail,
        subject:'Payment receipt',
        text: `click to get receipt: ${receipt}`
    })
  }
  async payByCash(appointmentId: number){
    const pay = await this.prisma.payment.update({
      where:{
        appointmentId
      },
      data:{
        status: 'paid'
      }
    })
    return pay
  }

}
