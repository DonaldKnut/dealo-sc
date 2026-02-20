import { useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type InsightsDialogProps = {
  course: {
    name: string;
    level: string;
    category: string;
  };
};

const InsightsDialog = ({ course }: InsightsDialogProps) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/generate-course-insights", {
        course,
      });
      const sanitizedInsights = DOMPurify.sanitize(response.data.insights);
      setInsights(sanitizedInsights);
    } catch {
      alert("Failed to generate insights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="w-full bg-[#292929] text-white hover:bg-[#565756]"
          onClick={generateInsights}
        >
          {loading ? "Loading Insights..." : "More Insights"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insights About {course.name}</DialogTitle>
        </DialogHeader>
        <div
          dangerouslySetInnerHTML={{
            __html: insights || "No insights available.",
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InsightsDialog;
