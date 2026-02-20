type CourseDetailProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

export const CourseDetail = ({ icon, label, value }: CourseDetailProps) => (
  <li className="flex items-center gap-3">
    <div className="bg-[#039049] p-2 rounded-full text-white">{icon}</div>
    <span>
      {label}: {value}
    </span>
  </li>
);
