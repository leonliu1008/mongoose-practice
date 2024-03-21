const e = require("express");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { Schema } = mongoose;
const port = 3000;
const fs = require("fs");

// middleware
app.use(express.json());
app.set("view engine", "ejs");

mongoose
  .connect("mongodb://127.0.0.1:27017/exampleDB") // 選DB名稱
  .then(() => {
    console.log("成功連結MongoDB!");
  })
  .catch((e) => {
    console.log(e);
  });

const studentSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 25 }, // required: true =>不能為空或 null 或 undefined
    age: { type: Number, min: [0, "年齡不能小於0"] },
    // major: {type:String, required:function(){return this.scholarship.merit >=3000;}},// 可以 return boolen ,依照獎學金判斷是否必填
    major: {
      type: String,
      required: [true, "至少要選一個主修"], // 放一個array 可以客製化 錯誤訊息
      // 可以設定必須符合的枚舉
      enum: {
        values: [
          "InformationEngineering",
          "JP",
          "En",
          "TV",
          "GAME",
          "undecided",
        ],
        message: "必須選學校內的主修範圍",
      },
    },
    scholarship: {
      merit: { type: Number, default: 0 }, // 可以設定預設值
      other: Number,
    },
  },
  {
    // 使用statics 範例
    statics: {
      findAllMajorStudents(major) {
        // console.log(this); // 印出:Model { Student }
        return this.find({ major: major }).exec();
      },
    },
  }
);

// mongoose 中間件
// 使用.pre設定在"save"之前會做的事情
studentSchema.pre("save", () => {
  fs.readFile("record.txt", "有新的Data被儲存..", (e) => {
    if (e) throw e;
  });
});

// instance method 範例
// const studentSchema = new Schema(
//   {
//     name: String,
//     age: Number,
//     major: {
//       type: String,
//     },
//     scholarship: {
//       merit: Number,
//       other: Number,
//     },
//   }
//   {
//     // instance method 來使用
//     methods: {
//       // 範例:寫一個加總獎學金
//       printTotalScholarship() {
//         return this.scholarship.merit + this.scholarship.other;
//       },
//     },
//   }
// );

// 將上面的 instance method 與 物件分離,直接宣告
studentSchema.methods.printTotalScholarship = function () {
  return this.scholarship.merit + this.scholarship.other;
};

const Student = mongoose.model("Student", studentSchema); // Student為collection名稱(table名稱)

// 使用statics 範例
async function findAllMajor(major) {
  try {
    let data = await Student.findAllMajorStudents(major);
    console.log(data);
  } catch (e) {
    console.log(e);
  }
}
findAllMajor("JP");

let newStudent = new Student({
  name: "中島",
  age: 27,
  major: "bass",
  scholarship: {
    other: 0,
  },
});

// newStudent
//   .save()
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

// Student.findOneAndUpdate(
//   { name: "Rolly Liu" },
//   { name: "Rolly" },
//   { runValidators: true, new: true } // 返回資料顯示更新之後或是更新之前
// )
//   .exec()
//   .then((newdata) => {
//     console.log(newdata);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

// Student.find({})
//   .exec()
//   .then((arr) => {
//     arr.forEach((student) => {
//       console.log(s
//         `${student.name}的總獎學金為${student.printTotalScholarship()}`
//       );
//     });
//   });

// .document.save() is return a promise
// .document.find() is return a promise
async function findStudent() {
  try {
    let data = await Student.find().exec(); // .find會返回array .findOne會返回單一個
    return data;
  } catch (e) {
    console.log(e);
    return e;
  }
}

app.get("/", async (req, res) => {
  let data = await findStudent();
  // console.log(data);
  res.send(data);
});

// Student.updateOne(
//   { name: "Leon" },
//   { age: 38 },
//   { runValidators: true, new: true } // new 對updateOne 無效
// )
//   .exec()
//   .then((msg) => {
//     console.log(msg);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

app.listen(port, () => {
  console.log(`伺服器啟動 on port ${port}`);
});
