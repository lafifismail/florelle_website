'use client';

import { Printer } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DeliveryNoteButtonProps {
    order: any; // Using any for flexibility with Prisma include types, cleaner to use generated types
}

export default function DeliveryNoteButton({ order }: DeliveryNoteButtonProps) {
    const shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : {};

    const generatePDF = () => {
        const doc = new jsPDF();

        // --- Header ---
        // Logo (Text for now, Image would need base64)
        doc.setFont("times", "bold");
        doc.setFontSize(24);
        doc.text("FLORELLE", 105, 20, { align: "center" });

        // Subtitle
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("MAGNIFIEZ VOTRE BEAUTÉ", 105, 26, { align: "center" });

        // Order Info
        doc.setFontSize(12);
        doc.text(`BON DE LIVRAISON`, 20, 45);
        doc.setFont("helvetica", "bold");
        doc.text(`COMMANDE #${order.id.slice(-6).toUpperCase()}`, 20, 52);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Date : ${new Date(order.createdAt).toLocaleDateString('fr-FR')}`, 20, 58);

        // --- Client Info Block (The "Pick & Pack" Helper) ---
        doc.setFillColor(250, 250, 250); // Light gray bg
        doc.roundedRect(110, 35, 80, 40, 2, 2, "F");

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("ADRESSE DE LIVRAISON", 115, 42);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(shippingAddress.fullName || "Client Inconnu", 115, 48);
        doc.text(shippingAddress.address || "Adresse non spécifiée", 115, 53, { maxWidth: 70 });
        doc.text(`${shippingAddress.postalCode || ''} ${shippingAddress.city || ''}`, 115, 63);

        // Phone number highlighted
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(shippingAddress.phone || "", 115, 70);

        // --- Items Table ---
        const tableBody = order.items.map((item: any) => [
            item.product.name,
            item.quantity,
            `${item.price.toFixed(2)} MAD`,
            `${(item.price * item.quantity).toFixed(2)} MAD`
        ]);

        autoTable(doc, {
            startY: 85,
            head: [['Article', 'Qté', 'Prix Unit.', 'Total']],
            body: tableBody,
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 5 },
            headStyles: { fillColor: [40, 40, 40], textColor: 255, fontStyle: 'bold' }, // Charcoal header
            columnStyles: {
                0: { cellWidth: 'auto' }, // Name
                1: { cellWidth: 20, halign: 'center' }, // Qty
                2: { cellWidth: 30, halign: 'right' }, // Price
                3: { cellWidth: 30, halign: 'right' }  // Total
            },
            foot: [['', '', 'Total à encaisser :', `${order.totalAmount.toFixed(2)} MAD`]],
            footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'right' }
        });

        // --- Footer ---
        const finalY = (doc as any).lastAutoTable.finalY || 150;

        doc.setFont("times", "italic");
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text("Merci de faire confiance à Florelle pour magnifier votre beauté.", 105, finalY + 20, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("Florelle Beauty - Casablanca, Maroc - www.florelle.ma", 105, 280, { align: "center" });

        // Save
        doc.save(`BL-Florelle-${order.id.slice(-6).toUpperCase()}.pdf`);
    };

    return (
        <button
            onClick={generatePDF}
            className="flex items-center gap-2 bg-white border border-charcoal/20 text-charcoal px-4 py-2 text-xs uppercase tracking-widest hover:bg-gold hover:text-white hover:border-gold transition-colors shadow-sm rounded-sm"
            title="Imprimer le Bon de Livraison"
        >
            <Printer size={16} />
            <span className="hidden md:inline">Imprimer BL</span>
        </button>
    );
}
