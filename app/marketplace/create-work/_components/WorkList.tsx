import WorkCard from "./WorkCard";

interface Work {
  _id: string;
  title: string;
  category: string;
  price: number;
  creator: {
    _id: string;
    username: string;
    profileImagePath: string;
  };
  workPhotoPaths: string[];
}

interface WorkListProps {
  data: Work[];
}

const WorkList: React.FC<WorkListProps> = ({ data }) => {
  return (
    <div className="px-4 md:px-5 py-16 flex flex-wrap justify-center gap-5">
      {data.map((work) => (
        <WorkCard key={work._id} work={work} />
      ))}
    </div>
  );
};

export default WorkList;
