import { verifyJWT } from "../../middlewares/verifyJWT";
import { ApiResponse } from "../../utils/ApiResponse";
import { ExpenceService } from "./expence.service";

export class ExpenceController {
  static async createExpence(req: Request) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized request");
    }
    try {
      const body = await req.json();
      const { title, amount, category, date, note } = body;
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
      return ApiResponse(200, data, "Expence fetched successfully");
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
      return ApiResponse(200, data, "Expence fetched successfully");
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
      const body = await req.json();
      const data = await ExpenceService.updateExpence(id, body);
      return ApiResponse(200, data, "Expence updated successfully");
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
      const data = await ExpenceService.deleteExpence(id);
      return ApiResponse(200, data, "Expence deleted successfully");
    } catch (error) {
      return ApiResponse(500, null, "Failed to delete expence");
    }
  }
}
