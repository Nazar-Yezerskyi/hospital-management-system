import { Controller, Post, RawBodyRequest, Req, Put, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService){}

  @Post('webhook')
    async handleStripeWebhook(@Req() req: RawBodyRequest<Request>): Promise<{ status: string; paymentIntentId: string | null; id: number; paymentMethod: string; amount: number; currency: string; createdAt: Date; updatedAt: Date | null; appointmentId: number; }> {
      const sig = req.headers['stripe-signature'];
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      const object = JSON.parse(req.rawBody.toString())
      console.log(object)
      let event;
      try {
        event = this.paymentService.getStripe().webhooks.constructEvent(req.rawBody, sig, endpointSecret);
        if (event.data.object.status === "succeeded") {
          const paymentIntent = event.data.object;
          return await this.paymentService.updatePaymentStatus(paymentIntent.metadata.paymentIntentId, "succeeded", paymentIntent.receipt_url);
        } else {
          console.log('Unhandled event type:', event.type);
        }
      } catch (error) {
        console.error('Error processing webhook event:', error);
        throw new Error('Webhook processing failed');
      }
    }
  @Put('/bycard/:appointmentId')
  async payByCard(@Param("appointmentId")appointmentId: string){
    const pay = await this.paymentService.payByCash(+appointmentId)
    return pay
  }
}
