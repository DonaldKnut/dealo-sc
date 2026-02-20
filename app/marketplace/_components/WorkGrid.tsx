// components/WorkGrid.tsx
import React from "react";
import { motion } from "framer-motion";
// import { Work } from "../types/work";
import ProductCard from "./ProductCard";
import { IWork } from "@/types";

interface WorkGridProps {
  data: IWork[];
}

const WorkGrid: React.FC<WorkGridProps> = ({ data }) => (
  <motion.div
    className="flex flex-wrap justify-start gap-6 p-4 w-[85%] m-auto"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {data.map((work) => (
      <ProductCard key={work._id} work={work} />
    ))}
  </motion.div>
);

export default WorkGrid;
