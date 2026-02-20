import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { CloudflareStreamDataModel } from "@/models/CloudflareStreamData";
import { SectionModel } from "@/models/Section";
import { addInstructorStorage } from "@/lib/instructorStorage";

interface CloudflareWebhookEvent {
  type: string;
  uid: string;
  input: {
    url?: string;
    metadata?: {
      name?: string;
      description?: string;
    };
  };
  output: {
    url?: string;
    thumbnail?: string;
    duration?: number;
    width?: number;
    height?: number;
  };
  status: {
    state: string;
    errorReasonCode?: string;
    errorReasonText?: string;
  };
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body: CloudflareWebhookEvent = await request.json();
    
    console.log("Cloudflare webhook received:", body);
    
    // Verify webhook signature if needed
    // const signature = request.headers.get("cf-webhook-signature");
    // if (!verifyWebhookSignature(body, signature)) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }
    
    const { type, uid, status, output } = body;
    
    if (type === "video.ready" && status.state === "ready") {
      // Video is ready, store metadata
      console.log(`Video ${uid} is ready for playback`);
      
      await connect();
      
      // Find section by Cloudflare Stream UID
      const streamData = await CloudflareStreamDataModel.findOne({ uid });
      
      if (streamData) {
        // Check if this is the first time the video becomes ready (to avoid double-counting storage)
        const wasAlreadyReady = streamData.status === "ready";
        
        // Update existing stream data
        streamData.playbackUrl = output.url;
        streamData.thumbnail = output.thumbnail;
        streamData.duration = output.duration;
        streamData.width = output.width;
        streamData.height = output.height;
        streamData.status = "ready";
        
        // If fileSize wasn't set during upload, try to get it from Cloudflare metadata
        // Note: Cloudflare doesn't return original file size, so we rely on it being set during upload
        if (!streamData.fileSize && streamData.instructorId) {
          console.warn(`Video ${uid} missing fileSize - storage tracking may be inaccurate`);
        }
        
        await streamData.save();
        
        // Update instructor storage if fileSize and instructorId are present
        // Only add storage when video becomes ready for the first time (not during upload or re-processing)
        if (!wasAlreadyReady && streamData.fileSize && streamData.instructorId) {
          try {
            await addInstructorStorage(streamData.instructorId.toString(), streamData.fileSize);
            console.log(`Updated storage for instructor ${streamData.instructorId}: +${streamData.fileSize} bytes`);
          } catch (storageError) {
            console.error("Error updating instructor storage:", storageError);
          }
        }
        
        console.log(`Updated CloudflareStreamData for video ${uid}`);
      } else {
        console.log(`No CloudflareStreamData found for video ${uid} - may need to be created during upload`);
      }
      
      return NextResponse.json({ 
        message: "Video processed successfully",
        uid,
        playbackUrl: output.url,
        thumbnail: output.thumbnail
      });
    }
    
    if (type === "video.upload.completed") {
      console.log(`Video upload completed for ${uid}`);
      
      return NextResponse.json({ 
        message: "Upload completed",
        uid 
      });
    }
    
    if (status.state === "error") {
      console.error(`Video processing error for ${uid}:`, {
        reason: status.errorReasonText,
        code: status.errorReasonCode
      });
      
      await connect();
      
      // Update stream data status to error
      const streamData = await CloudflareStreamDataModel.findOne({ uid });
      if (streamData) {
        streamData.status = "error";
        await streamData.save();
      }
      
      return NextResponse.json({ 
        error: "Video processing failed",
        uid,
        reason: status.errorReasonText 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      message: "Webhook processed",
      type,
      uid 
    });
    
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

// Optional: Verify webhook signature
function verifyWebhookSignature(payload: any, signature: string | null): boolean {
  if (!signature) return true; // Skip verification if no signature
  
  // Implement signature verification using your webhook secret
  // const expectedSignature = crypto
  //   .createHmac('sha256', process.env.CLOUDFLARE_WEBHOOK_SECRET!)
  //   .update(JSON.stringify(payload))
  //   .digest('hex');
  
  // return crypto.timingSafeEqual(
  //   Buffer.from(signature),
  //   Buffer.from(expectedSignature)
  // );
  
  return true; // For now, skip verification
}
