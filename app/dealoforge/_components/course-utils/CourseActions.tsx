import { useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CourseActionsProps = {
  course: {
    _id: string;
    name: string;
  };
  router: any;
};

const CourseActions = ({ course, router }: CourseActionsProps) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const generateInsights = async () => {
    setLoadingInsights(true);
    try {
      const response = await axios.post("/api/generate-course-insights", {
        course,
      });
      setInsights(
        DOMPurify.sanitize(
          response.data.insights.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
          )
        )
      );
    } catch (error) {
      alert("Failed to generate insights.");
    } finally {
      setLoadingInsights(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-4">
      <Button
        variant="secondary"
        className="w-full bg-[#292929] text-white hover:bg-[#565756]"
        onClick={() => router.push(`/dealoforge/courses/${course._id}`)}
      >
        Resume Course
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="w-full bg-[#292929] text-white hover:bg-[#565756]"
            onClick={generateInsights}
          >
            {loadingInsights ? "Loading Insights..." : "More Insights"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insights About {course.name}</DialogTitle>
          </DialogHeader>
          {loadingInsights ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : (
            <p
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html:
                  insights || "Generate insights by clicking the button above.",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseActions;
