import { verifyJWT } from "../../middlewares/verifyJWT";
import { CloudinaryService } from "../../services/cloudinary.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { getUrls } from "../../utils/geturl";
import { ExpenceService } from "./expence.service";

export class ExpenceController {
  static async createExpence(req: Request) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized request");
    }
    try {
      const formData = await req.formData();
      const title = formData.get("title") as string;
      const amount = formData.get("amount") as string;
      const category = formData.get("category") as string;
      const date = formData.get("date") as string;
      const note = formData.get("note") as string;

      if (!title) {
        return ApiResponse(400, null, "Title is required");
      }
      if (!amount) {
        return ApiResponse(400, null, "Amount is required");
      }
      if (!category) {
        return ApiResponse(400, null, "Category is required");
      }
      if (!date) {
        return ApiResponse(400, null, "Date is required");
      }

      const body: any = { title, amount, category, date, note };
      const file = formData.get("receipt") as File | null;
      if (file && file.size > 0) {
        const result = await CloudinaryService.upload(
          file,
          "expences",
          "image",
        );
        body.receipt = result?.url;
      }
      const data = await ExpenceService.createExpence(body);
      return ApiResponse(200, data, "Expence created successfully");
    } catch (error) {
      return ApiResponse(500, null, "Failed to create expence");
    }
  }

  static async getAllExpence(req: Request) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized request");
    }
    try {
      const data = await ExpenceService.getAllExpence();
      const expence = data.data.map((item: any) => {
        return {
          ...item,
          receipt: item.receipt ? getUrls.getUrl(item.receipt) : "",
        };
      });
      return ApiResponse(
        200,
        { ...data, data: expence },
        "Expence fetched successfully",
      );
    } catch (error) {
      return ApiResponse(500, null, "Failed to fetch expence");
    }
  }

  static async getExpenceById(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
  ) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized request");
    }
    try {
      const { id } = await params;
      const data = await ExpenceService.getExpenceById(id);
      const expence = {
        ...data,
        receipt: data.receipt ? getUrls.getUrl(data.receipt) : "",
      };
      return ApiResponse(200, expence, "Expence fetched successfully");
    } catch (error) {
      return ApiResponse(500, null, "Failed to fetch expence");
    }
  }

  static async updateExpence(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
  ) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized request");
    }
    try {
      const { id } = await params;
      const existingData = await ExpenceService.getExpenceById(id);

      const formData = await req.formData();
      const file = formData.get("receipt") as File | null;

      const body: any = {
        title: (formData.get("title") as string) || existingData.title,
        amount: (formData.get("amount") as string) || existingData.amount,
        category: (formData.get("category") as string) || existingData.category,
        date: (formData.get("date") as string) || existingData.date,
        note: (formData.get("note") as string) || existingData.note,
        receipt: existingData.receipt,
      };

      if (file && file.size > 0) {
        if (existingData.receipt) {
          await CloudinaryService.delete(existingData.receipt);
        }
        const result = await CloudinaryService.upload(
          file,
          "expences",
          "image",
        );
        body.receipt = result?.url;
      }
      const data = await ExpenceService.updateExpence(id, body);
      const expence = {
        ...data,
        receipt: data.receipt ? getUrls.getUrl(data.receipt) : "",
      };
      return ApiResponse(200, expence, "Expence updated successfully");
    } catch (error) {
      return ApiResponse(500, null, "Failed to update expence");
    }
  }

  static async deleteExpence(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
  ) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized request");
    }
    try {
      const { id } = await params;
      const data = await ExpenceService.getExpenceById(id);
      if (data.receipt) {
        await CloudinaryService.delete(data.receipt, "image");
      }
      const result = await ExpenceService.deleteExpence(id);
      return ApiResponse(200, result, "Expence deleted successfully");
    } catch (error) {
      return ApiResponse(500, null, "Failed to delete expence");
    }
  }
}
