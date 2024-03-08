import { PaginatedResponse, PaginationDTO } from "../schema/dto/pagination.dto";

export async function paginate({ model, ...data }: PaginationDTO): Promise<PaginatedResponse> {
  const limit = data.limit as number;
  const page = data.page as number;

  return await model
    .findAndCountAll({
      where: { ...data.query },
      offset: page * limit,
      limit,
    })
    .then(({ rows, count }) => {
      return { data: rows, total: count, limit, page };
    });
}
