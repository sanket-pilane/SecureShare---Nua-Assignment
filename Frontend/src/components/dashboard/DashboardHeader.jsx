import { motion } from "framer-motion";
import { FaHdd } from "react-icons/fa";
import { Card, CardContent } from "../ui/Card";
import { formatBytes } from "../../lib/utils";

const DashboardHeader = ({ userName, totalSize }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Welcome back, {userName}
        </h1>
        <p className="text-slate-400 mt-1">Manage your secure documents.</p>
      </div>

      <Card className="min-w-[200px] border-slate-800 bg-slate-900/50">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-full">
            <FaHdd size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase">
              Storage Used
            </p>
            <p className="text-xl font-bold">{formatBytes(totalSize)}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardHeader;
