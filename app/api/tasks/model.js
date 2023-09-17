const mongoose = require("mongoose");
const User = require("../users/model")
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title must be Insert"],
    },
    kode_task: {
      type: String,
      required: [true, "Kode Task must be Insert"],
    },
    deskripsi: {
      type: String,
      required: [true, "Description must be Insert"],
    },
    status: {
      type: String,
      enum: ["pending", "onprogress", "finish"],
      default: "pending",
    },
    komentar_service: {
      type: String,
      default:"",
    },
    gambar_service: {
      type: String,
      default:"",
    },
    gambar_service_URL: {
      type: String,
      default:"",
    },
    status_task: {
      type: String,
      enum: ["enable", "disable"],
      default: "enable",
    },
    modal_service: {
      type: Number,
      default:0
    },
    harga_service: {
      type: Number,
      default:0
    },
    nama_consumen: {
      type: String,
      required: [true, "Nama Consumen must be Insert"],
    },
    no_telp_consumen: {
      type: String,
      required: [true, "No Telp Consumen must be Insert"],
    },
    nama_barang: {
      type: String,
      required: [true, "Nama Barang must be Insert"],
    },
    id_servicer: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", TaskSchema);
