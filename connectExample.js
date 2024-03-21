const express = require("express");
const app = express();
const mongoose = require("mongoose"); // 1.(導入):const mongoose = require("mongoose");
const { Schema } = mongoose; // 2.(解構付值)將mongoose物件裡面的Schema拿來使用當Model
const port = 3000;

// 3.(連接資料庫的位置,以及 資料庫名稱:exampleDB)
mongoose
  .connect("mongodb://127.0.0.1:27017/exampleDB") // 選DB名稱
  .then(() => {
    console.log("成功連結MongoDB!");
  })
  .catch((e) => {
    console.log(e);
  });

// 4.(建立collection的Model) ps:可以建立多個Model
const studentSchema = new Schema({
  name: String,
  age: Number,
  major: String,
  scholarship: {
    merit: Number,
    other: Number,
  },
});

// 5.(將建立的collection Model 拿來使用)
const Student = mongoose.model("Student", studentSchema); // Student為collection名稱(table名稱)
const newObject = new Student({
  name: "Roy",
  age: 38,
  major: "GAME",
  scholarship: {
    merit: 500,
    other: 1000,
  },
});

// 新增儲存
// .document.save() is return a promise
// 接著會將儲存成功的資料return saveObject
// newObject
//   .save()
//   .then((saveObject) => {
//     console.log("資料儲存完畢．儲存的資料為:");
//     console.log(saveObject);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

// 查詢
Student.find({ "scholarship.merit": { $gte: 5000 } })
  .exec()
  .then((data) => {
    console.log(data);
  })
  .catch((e) => {
    console.log(e);
  });

// 刪除 第一個符合
// Student.deleteOne({ name: "Roy" })
//   .exec()
//   .then((msg) => {
//     console.log(msg);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

// 刪除多位
// Student.deleteMany({ "scholarship.merit": { $lt: 500 } }) // 刪除小於500
//   .exec()
//   .then((msg) => {
//     console.log(msg);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

// async await 寫法
// async function newObj() {
//   try {
//     let data = await newObject.save();
//     console.log("資料儲存完畢．儲存的資料為:");
//     console.log(data);
//   } catch (e) {
//     console.log(e);
//   }
// }
// newObj();

// app.listen(port, () => {
//   console.log(`伺服器啟動 on port ${port}`);
// });
