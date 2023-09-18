const { StatusCodes } = require("http-status-codes");

const CustomAPI = require("../../errors");
const Task = require("./model");
const User = require("../users/model");
const { generateRandomKodeTask } = require("../../utils");
// const Category = require("../category/model");
const cloudinary = require("cloudinary").v2;
const getAllTasks = async (req, res, next) => {
  try {
    const allTasks = await Task.find()
      .populate({ path: "id_servicer", select: "name email" })
      .sort({ updatedAt: -1 });

    return res.status(StatusCodes.OK).json({
      message: "Success",
      data: allTasks,
    });
  } catch (error) {
    next(error);
  }
};

const getOneTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id }).populate({
      path: "id_servicer",
      select: "name email",
    });
    if (!task) {
      throw new CustomAPI.NotFoundError("Task not found");
    }

    return res.status(StatusCodes.OK).json({
      message: "Success",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const createOneTask = async (req, res, next) => {
  try {
    const { title, deskripsi, nama_consumen, no_telp_consumen, nama_barang } =
      req.body;

    const result = new Task({
      title,
      deskripsi,
      kode_task: generateRandomKodeTask(8),
      status: "pending",
      komentar_service: "",
      gambar_service: "",
      gambar_service_URL: "",
      status_task: "enable",
      modal_service: 0,
      harga_service: 0,
      nama_consumen,
      no_telp_consumen,
      nama_barang,
    });

    await result.save();

    return res.status(StatusCodes.OK).json({
      message: "Success Create The Task",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      deskripsi,
      status,
      komentar_service,
      status_task,
      modal_service,
      harga_service,
      nama_consumen,
      no_telp_consumen,
      nama_barang,
      id_servicer,
    } = req.body;

    const result = await Task.findOne({ _id: id });

    if (!result) {
      throw new CustomAPI.NotFoundError("Not Found Task");
    }
    let servicer;
    const checkServicer = await User.findOne({ _id: id_servicer });
    if (!checkServicer) {
      servicer = null;
    } else {
      servicer = id_servicer;
    }

    if (!req.files) {
      result.title = title;
      result.deskripsi = deskripsi;
      result.status = status;
      result.komentar_service = komentar_service;
      result.status_task = status_task;
      result.modal_service = modal_service;
      result.harga_service = harga_service;
      result.nama_consumen = nama_consumen;
      result.no_telp_consumen = no_telp_consumen;
      result.nama_barang = nama_barang;
      result.id_servicer = servicer;

      await result.save();
      return res.status(StatusCodes.OK).json({
        message: "Success Updated The Product",
        data: result,
      });
    } else {
      const checkImg = req.files["gambar_service"] ? true : false;

      if (checkImg) {
        if (result.gambar_service) {
          await cloudinary.uploader.destroy(result.gambar_service);
        }
        console.log("url >> ", req.files["gambar_service"][0].path);
        result.gambar_service = req.files["gambar_service"][0].filename;
        result.gambar_service_URL = req.files["gambar_service"][0].path;
        console.log("gambar_service_URL >> ", result.gambar_service_URL);
      }

      result.title = title;
      result.deskripsi = deskripsi;
      result.status = status;
      result.komentar_service = komentar_service;
      result.status_task = status_task;
      result.modal_service = modal_service;
      result.harga_service = harga_service;
      result.nama_consumen = nama_consumen;
      result.no_telp_consumen = no_telp_consumen;
      result.nama_barang = nama_barang;
      result.id_servicer = servicer;

      await result.save();
      return res.status(StatusCodes.OK).json({
        message: "Success Updated The Product",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await Task.findOne({ _id: id });

    if (!result) {
      throw new CustomAPI.NotFoundError("Not Found Product");
    }

    const checkImg = result.gambar_service ? true : false;

    if (checkImg) {
      await cloudinary.uploader.destroy(result.gambar_service);
    }

    await Task.deleteOne({ _id: id });
    return res.status(StatusCodes.OK).json({
      message: "Success Deleted Item",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTasksByServicer = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const allTasks = await Task.find({ id_servicer: userId })
      .populate({ path: "id_servicer", select: "name email" })
      .sort({ updatedAt: -1 });

    return res.status(StatusCodes.OK).json({
      message: "Success",
      data: allTasks,
    });
  } catch (error) {
    next(error);
  }
};

const getOneTaskByKodeTask = async (req, res, next) => {
  try {
    const { kode } = req.params;
    const task = await Task.findOne({ kode_task: kode }).populate({
      path: "id_servicer",
      select: "name email",
    });
    if (!task) {
      throw new CustomAPI.NotFoundError("Task not found");
    }

    return res.status(StatusCodes.OK).json({
      message: "Success",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const giveCommentToTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { komentar_service } = req.body;

    const result = await Task.findOne({ _id: id });

    if (!result) {
      throw new CustomAPI.NotFoundError("Not Found Task");
    }


    result.komentar_service = komentar_service;

    await result.save();
    return res.status(StatusCodes.OK).json({
      message: "Success Updated The Product",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const markFinishTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await Task.findOne({ _id: id });

    if (!result) {
      throw new CustomAPI.NotFoundError("Not Found Task");
    }

   
    result.status = "finish";
    result.status_task = "disable";
  
    await result.save();
    return res.status(StatusCodes.OK).json({
      message: "Success Updated The Product",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const givePriceOfTask =async (req, res, next) => {
  try {
    const { id } = req.params;
    const {modal_service, harga_service} = req.body

    const result = await Task.findOne({ _id: id });
    if (!result) {
      throw new CustomAPI.NotFoundError("Not Found Task");
    }

   
    result.modal_service = modal_service;
    result.harga_service = harga_service;
  
    await result.save();
    return res.status(StatusCodes.OK).json({
      message: "Success Updated The Product",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const takeTaskByServicer =async (req, res, next) => {
  try {
    const { id } = req.params;
    const {userId} = req.user

    const result = await Task.findOne({ _id: id });
    if (!result) {
      throw new CustomAPI.NotFoundError("Not Found Task");
    }

    result.status="onprogress"
    result.id_servicer = userId;
  
    await result.save();
    return res.status(StatusCodes.OK).json({
      message: "Success Updated The Product",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const uploadImageTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await Task.findOne({ _id: id });

    if (!result) {
      throw new CustomAPI.NotFoundError("Not Found Task");
    }
    
    if (!req.files) {
      await result.save();
      return res.status(StatusCodes.OK).json({
        message: "Success Updated The Product",
        data: result,
      });
    } else {
      const checkImg = req.files["gambar_service"] ? true : false;

      if (checkImg) {
        if (result.gambar_service) {
          await cloudinary.uploader.destroy(result.gambar_service);
        }
       
        result.gambar_service = req.files["gambar_service"][0].filename;
        result.gambar_service_URL = req.files["gambar_service"][0].path;
        
      }

      await result.save();
      return res.status(StatusCodes.OK).json({
        message: "Success Updated The Product",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};



module.exports = {
  getAllTasks,
  createOneTask,
  getOneTask,
  updateTask,
  deleteTask,
  getAllTasksByServicer,
  getOneTaskByKodeTask,
  giveCommentToTask,
  markFinishTask,
  givePriceOfTask,
  takeTaskByServicer,
  uploadImageTask
};
