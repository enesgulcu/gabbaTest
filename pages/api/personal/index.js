import prisma from "@/lib/prisma";
import {
  createNewData,
  deleteDataAll,
  deleteDataByMany,
  getAllData,
  updateDataByMany,
} from "@/services/serviceOperations";

const handleDelete = async (req) => {
  let data = {};

  if (req.body.type === "one") {
    data = await deleteDataByMany("User", {
      id: {
        equals: req.body.id,
      },
    });
  }

  if (req.body.type === "selected") {
    data = await deleteDataByMany("User", {
      id: {
        in: req.body.ids,
      },
    });
  }

  if (req.body.type === "all") {
    data = await deleteDataAll("User");
  }

  if (!data || data.error) {
    throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4";
  }
  return {
    status: "success",
    data: data,
    message: data.message,
  };
};

const handler = async (req, res) => {
  try {
    if (req.method === "GET") {
      const financialManagementSpecial = await prisma["User"].findMany({
        where: {},
        include: {
          store: true,
        },
      });
      if (!financialManagementSpecial || financialManagementSpecial.error) {
        throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4";
      }
      return res.status(200).json({
        status: "success",
        data: financialManagementSpecial,
        message: financialManagementSpecial.message,
      });
    } else if (req.method === "DELETE") {
      const result = await handleDelete(req);
      return res.status(200).json(result);
    } else if (req.method === "PUT") {
      // Remove 'store' and 'storeId' keys from newData object
      const { Store, store, storeId, ...newDataWithoutStoreProps } = req.body.newData;

      const financialManagementSpecial = await updateDataByMany(
        "User",
        {
          id: {
            equals: req.body.id,
          },
        },
        Store ? { ...newDataWithoutStoreProps, storeId: Store.id } : { ...newDataWithoutStoreProps }
      );

      if (!financialManagementSpecial || financialManagementSpecial.error) {
        throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4";
      }

      return res.status(200).json({
        status: "success",
        data: financialManagementSpecial,
        message: financialManagementSpecial.message,
      });
    } else if (req.method === "POST") {
      const { Store, storeId, ...newDataWithoutStoreProps } = req.body.newData;

      const financialManagementSpecial = await createNewData("User", {
        ...newDataWithoutStoreProps,
      });

      if (!financialManagementSpecial || financialManagementSpecial.error) {
        throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4";
      }
      return res.status(200).json({
        status: "success",
        data: financialManagementSpecial,
        message: financialManagementSpecial.message,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "error", error, message: error.message });
  }
};

export default handler;
