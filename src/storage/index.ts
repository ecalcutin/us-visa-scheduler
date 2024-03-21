import mongoose from "mongoose";

import { Schedule } from "../interfaces";

// mongoose.connect(
//   "mongodb://root:Iamtheone1@database:27017/visa-automate?retryWrites=true&w=majority&authSource=admin"
// );

mongoose.connect(
  "mongodb://root:Iamtheone1@database:27017/visa-automate?retryWrites=true&w=majority&authSource=admin"
);
export const ScheduleHash = mongoose.model(
  "schedule",
  new mongoose.Schema({
    country: {
      type: String,
      unique: true,
    },
    hash: String,
  })
);

export const updateSchedule = async (result: {
  dates: Schedule[];
  email: string;
}): Promise<void> => {
  await ScheduleHash.updateOne(
    {
      country: "am",
    },
    {
      hash: JSON.stringify(result),
    },
    { upsert: true }
  );
};
