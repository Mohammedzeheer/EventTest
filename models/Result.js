import mongoose, { Schema } from "mongoose"

const resultSchema = new Schema(
    {
        ResultNo: Number,
        category: String,
        item: String,
        firstPrize: String,
        firstTeam: String,
        secondPrize: String,
        secondTeam: String,
        thirdPrize: String,
        thirdTeam: String,
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const ResultModel = mongoose.models.resultn || mongoose.model("resultn", resultSchema);
export default ResultModel;

// import mongoose, {Schema} from "mongoose"

// const resultSchema = new Schema(
//     {
//         category: String,
//         item: String,
//         firstPrize: String,
//         firstTeam: String,
//         secondPrize: String,
//         secondTeam: String,
//         thirdPrize: String,
//         thirdTeam: String,
//     }
// );

// const ResultModel = mongoose.models.resultN || mongoose.model("resultN",resultSchema);

// export default ResultModel