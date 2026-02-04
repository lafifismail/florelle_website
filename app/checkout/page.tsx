import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import CheckoutClient from "./CheckoutClient";
import { Navbar } from "@/components/layout/Navbar";

import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { Footer } from '@/components/layout/Footer';

export default async function CheckoutPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login?callbackUrl=/checkout");
    }

    return (
        <div className="min-h-screen flex flex-col bg-off-white">
            <Navbar />
            <CheckoutClient />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
