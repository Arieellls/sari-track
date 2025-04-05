"use server";

import {
  compileClearanceTemplate,
  compileIndigencyTemplate,
  compileResidencyTemplate,
  generatePDF
} from "@/lib/mail";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
export async function POST(request: Request) {
  try {
    const { fullName, purpose, service, start, end } = await request.json();

    let htmlBody = "";
    let fileName = "";

    switch (service) {
      case "Barangay Indigency":
        fileName = service;
        htmlBody = compileIndigencyTemplate(fullName, purpose, start, end);
        break;
      case "Barangay Clearance":
        fileName = service;
        htmlBody = compileClearanceTemplate(fullName, purpose, start);
        break;
      case "Barangay Residency":
        fileName = service;
        htmlBody = compileResidencyTemplate(fullName, purpose, start);
        break;
      default:
        throw new Error("Invalid service type");
    }

    const pdfBuffer = await generatePDF(htmlBody);
    const pdfBase64 = pdfBuffer.toString("base64");

    const { data, error } = await resend.emails.send({
      from: "Barangay Document Processing System <noreply@aryel.works>",
      to: "arielitorobles1525@gmail.com",
      subject: "Releasing of requested document",
      attachments: [
        {
          filename: `${fileName}.pdf`,
          content: pdfBase64
        }
      ],
      html: htmlBody
    });

    if (error) {
      console.error("Failed to send email:", error);
      return NextResponse.json(
        { message: "Failed to send email", error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: `Email sent successfully to ${fullName}` },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { message: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
