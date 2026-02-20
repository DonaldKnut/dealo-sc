// WebRTC Signaling Utility
export class WebRTCSignaling {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private onRemoteStream: ((stream: MediaStream) => void) | null = null;
  private onConnectionStateChange: ((state: string) => void) | null = null;

  constructor() {
    this.initializePeerConnection();
  }

  private initializePeerConnection() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
      ],
      iceCandidatePoolSize: 10,
    });

    // Handle incoming tracks
    this.peerConnection.ontrack = (event) => {
      if (this.onRemoteStream) {
        this.onRemoteStream(event.streams[0]);
      }
    };

    // Monitor connection state
    this.peerConnection.oniceconnectionstatechange = () => {
      if (this.onConnectionStateChange) {
        this.onConnectionStateChange(
          this.peerConnection?.iceConnectionState || "disconnected"
        );
      }
    };

    // Monitor ICE gathering state
    this.peerConnection.onicegatheringstatechange = () => {
      console.log(
        "ICE gathering state:",
        this.peerConnection?.iceGatheringState
      );
    };
  }

  async startLocalStream(constraints: MediaStreamConstraints = {}) {
    try {
      const defaultConstraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
          frameRate: { ideal: 30, min: 15 },
          facingMode: "user",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: { ideal: 48000 },
        },
        ...constraints,
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(
        defaultConstraints
      );

      // Add tracks to peer connection
      this.localStream.getTracks().forEach((track) => {
        if (this.peerConnection) {
          this.peerConnection.addTrack(track, this.localStream!);
        }
      });

      return this.localStream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      throw error;
    }
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error("Peer connection not initialized");
    }

    try {
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });

      await this.peerConnection.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error;
    }
  }

  async createAnswer(
    offer: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error("Peer connection not initialized");
    }

    try {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      return answer;
    } catch (error) {
      console.error("Error creating answer:", error);
      throw error;
    }
  }

  async setRemoteDescription(description: RTCSessionDescriptionInit) {
    if (!this.peerConnection) {
      throw new Error("Peer connection not initialized");
    }

    try {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(description)
      );
    } catch (error) {
      console.error("Error setting remote description:", error);
      throw error;
    }
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.peerConnection) {
      throw new Error("Peer connection not initialized");
    }

    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
      throw error;
    }
  }

  onIceCandidate(callback: (candidate: RTCIceCandidate) => void) {
    if (this.peerConnection) {
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          callback(event.candidate);
        }
      };
    }
  }

  setOnRemoteStream(callback: (stream: MediaStream) => void) {
    this.onRemoteStream = callback;
  }

  setOnConnectionStateChange(callback: (state: string) => void) {
    this.onConnectionStateChange = callback;
  }

  getConnectionState(): string {
    return this.peerConnection?.iceConnectionState || "disconnected";
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  async toggleAudio(enabled: boolean) {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = enabled;
      }
    }
  }

  async toggleVideo(enabled: boolean) {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = enabled;
      }
    }
  }

  async switchCamera() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        const constraints = videoTrack.getConstraints();
        const newFacingMode =
          constraints.facingMode === "user" ? "environment" : "user";

        try {
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: { ...constraints, facingMode: newFacingMode },
            audio: false,
          });

          const newVideoTrack = newStream.getVideoTracks()[0];
          const sender = this.peerConnection
            ?.getSenders()
            .find((s) => s.track?.kind === "video");

          if (sender && newVideoTrack) {
            sender.replaceTrack(newVideoTrack);

            // Update local stream
            const oldVideoTrack = this.localStream.getVideoTracks()[0];
            this.localStream.removeTrack(oldVideoTrack);
            this.localStream.addTrack(newVideoTrack);
          }

          // Stop the old stream
          newStream.getTracks().forEach((track) => {
            if (track.kind === "video") {
              track.stop();
            }
          });
        } catch (error) {
          console.error("Error switching camera:", error);
        }
      }
    }
  }

  async startScreenShare() {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      const videoTrack = screenStream.getVideoTracks()[0];
      const sender = this.peerConnection
        ?.getSenders()
        .find((s) => s.track?.kind === "video");

      if (sender && videoTrack) {
        sender.replaceTrack(videoTrack);
      }

      // Handle screen share stop
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      return screenStream;
    } catch (error) {
      console.error("Error starting screen share:", error);
      throw error;
    }
  }

  async stopScreenShare() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      const sender = this.peerConnection
        ?.getSenders()
        .find((s) => s.track?.kind === "video");

      if (sender && videoTrack) {
        sender.replaceTrack(videoTrack);
      }
    }
  }

  getStats(): Promise<RTCStatsReport> | null {
    return this.peerConnection?.getStats() || null;
  }

  close() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }
    if (this.peerConnection) {
      this.peerConnection.close();
    }
  }
}

// Utility functions
export const getVideoQuality = (width: number, height: number): string => {
  const pixels = width * height;
  if (pixels >= 2073600) return "1080p"; // 1920x1080
  if (pixels >= 921600) return "720p"; // 1280x720
  if (pixels >= 480000) return "480p"; // 800x600
  return "360p";
};

export const getConnectionQuality = (stats: RTCStatsReport): string => {
  // This is a simplified version - in a real app you'd analyze RTT, packet loss, etc.
  return "excellent";
};

export const generateRoomId = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
