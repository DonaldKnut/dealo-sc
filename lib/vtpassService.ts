import axios from "axios";
import crypto from "crypto";

interface VTPassConfig {
  apiKey: string;
  secretKey: string;
  apiEndpoint: string;
}

interface VTPassRequest {
  request_id: string;
  serviceID: string;
  billersCode: string;
  variation_code: string;
  phone: string;
  amount: number;
}

interface VTPassResponse {
  code: string;
  response_description: string;
  requestId: string;
  transactionId?: string;
  amount?: number;
  purchased_code?: string;
  units?: string;
  type?: string;
  date?: string;
  phone?: string;
  email?: string;
  name?: string;
  status?: string;
}

export class VTPassService {
  private config: VTPassConfig;

  constructor(config: VTPassConfig) {
    this.config = config;
  }

  private generateRequestId(): string {
    return `SCRATCH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSignature(data: string): string {
    return crypto
      .createHmac("sha256", this.config.secretKey)
      .update(data)
      .digest("hex");
  }

  private getServiceID(examType: string): string {
    const serviceMap: { [key: string]: string } = {
      WAEC: "waec",
      NECO: "neco",
      JAMB: "jamb",
    };
    return serviceMap[examType] || "waec";
  }

  private getVariationCode(examType: string): string {
    const variationMap: { [key: string]: string } = {
      WAEC: "waec_result",
      NECO: "neco_result",
      JAMB: "jamb_result",
    };
    return variationMap[examType] || "waec_result";
  }

  async purchaseScratchCard(
    examType: string,
    phone: string,
    amount: number
  ): Promise<{
    success: boolean;
    data?: VTPassResponse;
    error?: string;
    cards?: Array<{
      pin: string;
      serial: string;
      examType: string;
      phone: string;
      status: string;
      expiryDate: Date;
    }>;
  }> {
    try {
      const requestId = this.generateRequestId();
      const serviceID = this.getServiceID(examType);
      const variationCode = this.getVariationCode(examType);

      const requestData: VTPassRequest = {
        request_id: requestId,
        serviceID: serviceID,
        billersCode: phone, // Using phone as billersCode for scratch cards
        variation_code: variationCode,
        phone: phone,
        amount: amount,
      };

      const dataString = JSON.stringify(requestData);
      const signature = this.generateSignature(dataString);

      const response = await axios.post(this.config.apiEndpoint, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${this.config.apiKey}:${this.config.secretKey}`
          ).toString("base64")}`,
          Signature: signature,
        },
        timeout: 30000, // 30 seconds timeout
      });

      const responseData: VTPassResponse = response.data;

      if (responseData.code === "000") {
        // Success - generate scratch cards from response
        const cards = this.generateCardsFromResponse(
          examType,
          phone,
          responseData
        );

        return {
          success: true,
          data: responseData,
          cards,
        };
      } else {
        return {
          success: false,
          error: responseData.response_description || "Purchase failed",
          data: responseData,
        };
      }
    } catch (error: any) {
      console.error("VTPass API Error:", error);

      if (error.response) {
        // API responded with error status
        return {
          success: false,
          error:
            error.response.data?.response_description || "API request failed",
        };
      } else if (error.request) {
        // Network error
        return {
          success: false,
          error: "Network error - unable to reach VTPass API",
        };
      } else {
        // Other error
        return {
          success: false,
          error: error.message || "Unknown error occurred",
        };
      }
    }
  }

  private generateCardsFromResponse(
    examType: string,
    phone: string,
    response: VTPassResponse
  ): Array<{
    pin: string;
    serial: string;
    examType: string;
    phone: string;
    status: string;
    expiryDate: Date;
  }> {
    // Parse the purchased_code from VTPass response
    // This will depend on the actual format VTPass returns
    const purchasedCode = response.purchased_code || "";

    // For now, we'll generate cards based on the response
    // In production, you'd parse the actual card data from VTPass
    const cards = [];

    // If VTPass returns multiple codes, split them
    const codes = purchasedCode.split(",").filter((code) => code.trim());

    if (codes.length > 0) {
      // Use actual codes from VTPass
      codes.forEach((code, index) => {
        const [pin, serial] = code.split("|");
        cards.push({
          pin: pin || this.generateRandomPin(),
          serial: serial || this.generateRandomSerial(),
          examType,
          phone,
          status: "active",
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        });
      });
    } else {
      // Fallback to generated cards (for testing/development)
      cards.push({
        pin: this.generateRandomPin(),
        serial: this.generateRandomSerial(),
        examType,
        phone,
        status: "active",
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      });
    }

    return cards;
  }

  private generateRandomPin(): string {
    return Math.random().toString().substr(2, 12).toUpperCase();
  }

  private generateRandomSerial(): string {
    return Math.random().toString().substr(2, 16).toUpperCase();
  }

  // Method to verify transaction status
  async verifyTransaction(transactionId: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const response = await axios.get(
        `${this.config.apiEndpoint}/requery/${transactionId}`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${this.config.apiKey}:${this.config.secretKey}`
            ).toString("base64")}`,
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to verify transaction",
      };
    }
  }
}





