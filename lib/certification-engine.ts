import { GoogleGenerativeAI } from "@google/generative-ai";
import { Assessment, Certification, Profession } from "@/models";
import { connect } from "@/database";

// AI Model Configuration
const AI_MODELS = {
  basic: {
    provider: "gemini",
    model: "gemini-1.5-flash",
    costPer1KTokens: 0.0, // Free tier
    maxTokens: 8192,
  },
  standard: {
    provider: "gemini",
    model: "gemini-1.5-pro",
    costPer1KTokens: 0.0, // Free tier
    maxTokens: 16384,
  },
  premium: {
    provider: "gemini",
    model: "gemini-1.5-pro",
    costPer1KTokens: 0.0, // Free tier
    maxTokens: 32768,
  },
  custom: {
    provider: "gemini",
    model: "gemini-1.5-flash",
    costPer1KTokens: 0.0, // Free tier
    maxTokens: 8192,
  },
};

// Assessment Complexity Levels
export enum AssessmentComplexity {
  BASIC = 1,
  STANDARD = 2,
  PREMIUM = 3,
  ADVANCED = 4,
  EXPERT = 5,
}

// Assessment Types
export enum AssessmentType {
  WRITTEN = "written",
  PRACTICAL = "practical",
  INTERVIEW = "interview",
  PORTFOLIO = "portfolio",
  CASE_STUDY = "case_study",
}

interface AssessmentConfig {
  type: AssessmentType;
  duration: number; // minutes
  questions: number;
  aiModel: keyof typeof AI_MODELS;
  cost: number;
  weight: number;
}

interface ProfessionConfig {
  id: string;
  name: string;
  category: string;
  complexity: AssessmentComplexity;
  assessments: AssessmentConfig[];
  totalCost: number;
  pricing: number;
  margin: number;
}

export class CertificationEngine {
  private genAI: GoogleGenerativeAI;
  private professionConfigs: Map<string, ProfessionConfig>;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
    this.professionConfigs = new Map();
    this.initializeProfessionConfigs();
  }

  private initializeProfessionConfigs() {
    // Software Developer Configuration
    this.professionConfigs.set("software-developer", {
      id: "software-developer",
      name: "Software Developer",
      category: "Technology",
      complexity: AssessmentComplexity.ADVANCED,
      assessments: [
        {
          type: AssessmentType.WRITTEN,
          duration: 60,
          questions: 20,
          aiModel: "standard",
          cost: 3.0,
          weight: 0.25,
        },
        {
          type: AssessmentType.PRACTICAL,
          duration: 120,
          questions: 3,
          aiModel: "custom",
          cost: 8.0,
          weight: 0.35,
        },
        {
          type: AssessmentType.INTERVIEW,
          duration: 45,
          questions: 15,
          aiModel: "premium",
          cost: 5.0,
          weight: 0.2,
        },
        {
          type: AssessmentType.PORTFOLIO,
          duration: 30,
          questions: 5,
          aiModel: "standard",
          cost: 2.0,
          weight: 0.2,
        },
      ],
      totalCost: 18.0,
      pricing: 199,
      margin: 0.92,
    });

    // Digital Marketer Configuration
    this.professionConfigs.set("digital-marketer", {
      id: "digital-marketer",
      name: "Digital Marketer",
      category: "Marketing",
      complexity: AssessmentComplexity.STANDARD,
      assessments: [
        {
          type: AssessmentType.WRITTEN,
          duration: 45,
          questions: 15,
          aiModel: "basic",
          cost: 1.5,
          weight: 0.3,
        },
        {
          type: AssessmentType.PRACTICAL,
          duration: 90,
          questions: 2,
          aiModel: "standard",
          cost: 4.0,
          weight: 0.4,
        },
        {
          type: AssessmentType.CASE_STUDY,
          duration: 60,
          questions: 1,
          aiModel: "standard",
          cost: 3.0,
          weight: 0.3,
        },
      ],
      totalCost: 8.5,
      pricing: 99,
      margin: 0.85,
    });
  }

  async startAssessment(userId: string, professionId: string): Promise<string> {
    await connect();

    const profession = this.professionConfigs.get(professionId);
    if (!profession) {
      throw new Error(`Profession ${professionId} not found`);
    }

    // Create assessment record
    const assessment = new Assessment({
      userId,
      professionId,
      status: "in_progress",
      startedAt: new Date(),
      totalCost: profession.totalCost,
      expectedDuration: profession.assessments.reduce(
        (sum, a) => sum + a.duration,
        0
      ),
    });

    await assessment.save();
    return assessment._id.toString();
  }

  async generateQuestions(
    assessmentId: string,
    assessmentType: AssessmentType
  ): Promise<any[]> {
    await connect();

    const assessment = await Assessment.findById(assessmentId).populate(
      "professionId"
    );
    if (!assessment) {
      throw new Error("Assessment not found");
    }

    const profession = this.professionConfigs.get(assessment.professionId.id);
    
    if (!profession) {
      throw new Error("Profession configuration not found");
    }
    
    const config = profession.assessments.find(
      (a) => a.type === assessmentType
    );

    if (!config) {
      throw new Error(
        `Assessment type ${assessmentType} not configured for this profession`
      );
    }

    const aiModel = AI_MODELS[config.aiModel];
    const prompt = this.generateQuestionPrompt(
      profession,
      assessmentType,
      config.questions
    );

    try {
      const model = this.genAI.getGenerativeModel({ model: aiModel.model });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const questions = this.parseQuestions(text);

      // Calculate AI cost (free with Gemini)
      const cost = 0;

      // Update assessment with cost
      await Assessment.findByIdAndUpdate(assessmentId, {
        $inc: { aiCost: cost },
        $set: { [`${assessmentType}Questions`]: questions },
      });

      return questions;
    } catch (error) {
      console.error("Error generating questions:", error);
      throw new Error("Failed to generate assessment questions");
    }
  }

  private generateQuestionPrompt(
    profession: ProfessionConfig,
    type: AssessmentType,
    count: number
  ): string {
    const basePrompt = `Generate ${count} professional assessment questions for a ${profession.name} certification.`;

    const typeSpecificPrompts = {
      [AssessmentType.WRITTEN]: `${basePrompt} Focus on theoretical knowledge, best practices, and industry standards. Include multiple choice and short answer questions.`,
      [AssessmentType.PRACTICAL]: `${basePrompt} Focus on hands-on skills, problem-solving, and real-world scenarios. Include coding challenges, case studies, and practical exercises.`,
      [AssessmentType.INTERVIEW]: `${basePrompt} Focus on communication skills, problem-solving approach, and technical depth. Include behavioral and technical interview questions.`,
      [AssessmentType.PORTFOLIO]: `${basePrompt} Focus on project evaluation, code quality, and professional standards. Include portfolio review criteria and assessment rubrics.`,
      [AssessmentType.CASE_STUDY]: `${basePrompt} Focus on strategic thinking, analysis, and decision-making. Include complex scenarios requiring comprehensive analysis.`,
    };

    return typeSpecificPrompts[type] || basePrompt;
  }

  private parseQuestions(content: string): any[] {
    try {
      // Parse the AI response and extract questions
      // This is a simplified parser - in production, you'd want more robust parsing
      const questions = JSON.parse(content);
      return Array.isArray(questions) ? questions : [];
    } catch (error) {
      console.error("Error parsing questions:", error);
      return [];
    }
  }

  async evaluateResponse(
    assessmentId: string,
    assessmentType: AssessmentType,
    responses: any[]
  ): Promise<number> {
    await connect();

    const assessment = await Assessment.findById(assessmentId).populate(
      "professionId"
    );
    const profession = this.professionConfigs.get(assessment.professionId.id);
    
    if (!profession) {
      throw new Error("Profession configuration not found");
    }
    
    const config = profession.assessments.find(
      (a) => a.type === assessmentType
    );
    
    if (!config) {
      throw new Error("Assessment configuration not found");
    }

    const aiModel = AI_MODELS[config.aiModel];
    const evaluationPrompt = this.generateEvaluationPrompt(
      profession,
      assessmentType,
      responses
    );

    try {
      const model = this.genAI.getGenerativeModel({ model: aiModel.model });
      const result = await model.generateContent(evaluationPrompt);
      const response = await result.response;
      const text = response.text();

      const score = this.parseScore(text);

      // Calculate AI cost (free with Gemini)
      const cost = 0;

      // Update assessment
      await Assessment.findByIdAndUpdate(assessmentId, {
        $inc: { aiCost: cost },
        $set: {
          [`${assessmentType}Score`]: score,
          [`${assessmentType}Completed`]: true,
        },
      });

      return score;
    } catch (error) {
      console.error("Error evaluating response:", error);
      throw new Error("Failed to evaluate assessment response");
    }
  }

  private generateEvaluationPrompt(
    profession: ProfessionConfig,
    type: AssessmentType,
    responses: any[]
  ): string {
    return `Evaluate the following ${profession.name} ${type} assessment responses. Provide a score from 0-100 based on accuracy, completeness, and professional standards. Consider industry best practices and current trends.`;
  }

  private parseScore(content: string): number {
    try {
      const score = parseFloat(content.match(/\d+/)?.[0] || "0");
      return Math.min(Math.max(score, 0), 100);
    } catch (error) {
      return 0;
    }
  }

  async calculateFinalScore(assessmentId: string): Promise<number> {
    await connect();

    const assessment = await Assessment.findById(assessmentId).populate(
      "professionId"
    );
    const profession = this.professionConfigs.get(assessment.professionId.id);
    
    if (!profession) {
      throw new Error("Profession configuration not found");
    }

    let totalScore = 0;
    let totalWeight = 0;

    for (const config of profession.assessments) {
      const score = assessment[`${config.type}Score`] || 0;
      totalScore += score * config.weight;
      totalWeight += config.weight;
    }

    const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0;

    // Update assessment with final score
    await Assessment.findByIdAndUpdate(assessmentId, {
      $set: {
        finalScore,
        status: "completed",
        completedAt: new Date(),
      },
    });

    return finalScore;
  }

  async generateCertification(assessmentId: string): Promise<any> {
    await connect();

    const assessment = await Assessment.findById(assessmentId).populate([
      "userId",
      "professionId",
    ]);
    const finalScore = await this.calculateFinalScore(assessmentId);

    // Determine certification level
    const level = this.determineCertificationLevel(finalScore);

    // Generate certificate
    const certificate = new Certification({
      userId: assessment.userId._id,
      professionId: assessment.professionId._id,
      assessmentId: assessment._id,
      score: finalScore,
      level,
      issuedAt: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      certificateUrl: await this.generateCertificatePDF(
        assessment,
        finalScore,
        level
      ),
      badgeUrl: await this.generateBadge(level, assessment.professionId.name),
    });

    await certificate.save();
    return certificate;
  }

  private determineCertificationLevel(score: number): string {
    if (score >= 95) return "expert";
    if (score >= 85) return "advanced";
    if (score >= 75) return "intermediate";
    if (score >= 65) return "basic";
    return "failed";
  }

  private async generateCertificatePDF(
    assessment: any,
    score: number,
    level: string
  ): Promise<string> {
    // Implementation for generating PDF certificate
    // This would integrate with a PDF generation service
    return `https://certificates.dealo.com/${assessment._id}.pdf`;
  }

  private async generateBadge(
    level: string,
    profession: string
  ): Promise<string> {
    // Implementation for generating digital badge
    // This would integrate with a badge generation service
    return `https://badges.dealo.com/${profession}-${level}.png`;
  }

  // Cost optimization methods
  async batchProcessAssessments(assessmentIds: string[]): Promise<void> {
    // Process multiple assessments together to reduce AI costs
    const batchSize = 10;

    for (let i = 0; i < assessmentIds.length; i += batchSize) {
      const batch = assessmentIds.slice(i, i + batchSize);
      await Promise.all(batch.map((id) => this.processAssessmentBatch(id)));
    }
  }

  private async processAssessmentBatch(assessmentId: string): Promise<void> {
    // Batch processing logic
    console.log(`Processing assessment ${assessmentId} in batch`);
  }

  // Analytics methods
  async getAssessmentAnalytics(): Promise<any> {
    await connect();

    const analytics = await Assessment.aggregate([
      {
        $group: {
          _id: null,
          totalAssessments: { $sum: 1 },
          averageScore: { $avg: "$finalScore" },
          totalCost: { $sum: "$aiCost" },
          averageCompletionTime: {
            $avg: {
              $subtract: ["$completedAt", "$startedAt"],
            },
          },
        },
      },
    ]);

    return analytics[0] || {};
  }
}

export const certificationEngine = new CertificationEngine();
