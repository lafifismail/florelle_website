export function OrderConfirmationEmail(orderId: string, customerName: string, items: any[], totalAmount: number, shippingFee?: number) {
    const subject = `Confirmation de commande #${orderId.slice(-6).toUpperCase()} - Florelle Beauty`;

    const itemsHtml = items.map(item => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 15px 0; color: #333;">${item.name}</td>
            <td style="padding: 15px 0; text-align: center; color: #666;">${item.quantity}</td>
            <td style="padding: 15px 0; text-align: right; color: #333; font-weight: bold;">${(item.price * item.quantity).toFixed(0)} MAD</td>
        </tr>
    `).join('');

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmation de Commande</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9f7f2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 0; background-color: #fdfbf7; border-bottom: 2px solid #D4AF37;">
                            <h1 style="color: #333; margin: 0; font-family: 'Times New Roman', serif; letter-spacing: 2px; font-size: 28px;">FLORELLE</h1>
                            <p style="color: #D4AF37; margin: 5px 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 3px;">Magnifiez votre beauté</p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="color: #666; font-size: 16px; line-height: 24px;">Bonjour ${customerName},</p>
                            <p style="color: #333; font-size: 18px; font-weight: bold; margin-bottom: 20px;">
                                Merci pour votre commande #${orderId.slice(-6).toUpperCase()} !<br>
                                <span style="font-weight: normal; font-size: 16px; color: #666;">Nous préparons votre écrin de beauté avec le plus grand soin.</span>
                            </p>

                            <!-- Items Table -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
                                <tr style="color: #D4AF37; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">
                                    <th align="left" style="padding-bottom: 10px; border-bottom: 1px solid #eee;">Produit</th>
                                    <th align="center" style="padding-bottom: 10px; border-bottom: 1px solid #eee;">Qté</th>
                                    <th align="right" style="padding-bottom: 10px; border-bottom: 1px solid #eee;">Total</th>
                                </tr>
                                ${itemsHtml}
                                <tr>
                                    <td colspan="2" align="right" style="padding-top: 10px; color: #999; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">Sous-total</td>
                                    <td align="right" style="padding-top: 10px; font-size: 14px; color: #666;">${(totalAmount - (shippingFee || 0)).toFixed(0)} MAD</td>
                                </tr>
                                <tr>
                                    <td colspan="2" align="right" style="padding-top: 5px; color: #999; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">Livraison</td>
                                    <td align="right" style="padding-top: 5px; font-size: 14px; color: #D4AF37;">${shippingFee ? shippingFee + ' MAD' : 'OFFERTE'}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" align="right" style="padding-top: 15px; color: #666; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; border-top: 1px solid #eee;">Total à payer</td>
                                    <td align="right" style="padding-top: 15px; font-size: 20px; color: #D4AF37; font-weight: bold; font-family: 'Times New Roman', serif;">${totalAmount.toFixed(0)} MAD</td>
                                </tr>
                            </table>

                            <!-- CTA Button -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" style="padding: 30px 0;">
                                        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/profile/orders/${orderId}" style="background-color: #D4AF37; color: #ffffff; padding: 15px 30px; text-decoration: none; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; font-weight: bold; border-radius: 2px;">
                                            Suivre ma commande
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #333; padding: 30px; text-align: center;">
                            <p style="color: #D4AF37; margin: 0; font-family: 'Times New Roman', serif; font-style: italic;">"Merci de sublimer votre beauté avec Florelle."</p>
                            <p style="color: #666; font-size: 10px; margin-top: 20px;">
                                Florelle Beauty &copy; ${new Date().getFullYear()}<br>
                                Si vous avez des questions, répondez à cet email.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    return { subject, html };
}
