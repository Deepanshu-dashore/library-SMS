import { ExpenceController } from "@/app/lib/featuers/expencess/expence.controller";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return await ExpenceController.getExpenceById(req, { params });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return await ExpenceController.updateExpence(req, { params });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return await ExpenceController.deleteExpence(req, { params });
}
