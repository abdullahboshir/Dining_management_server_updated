import { FilterQuery, Query } from 'mongoose'

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>
  public query: Record<string, unknown>

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery
    this.query = query
  }

  //   Shortcut way
  //   constructor(
  //     public modelQuery: Query<T[], T>,
  //     public query: Record<string, unknown>,
  //   ) {}

  search(searchableFields: any) {
    const searchTerm = this.query?.searchTerm?.toString().trim()
    if (!searchTerm) return this

    const isNumber = !isNaN(Number(searchTerm))

    console.log('modellllllllllllll', typeof searchTerm)
    const conditions: FilterQuery<T>[] = Object.keys(searchableFields).flatMap(
      (field) => {
        const type = searchableFields[field]
        if (type === 'number' && isNumber) {
          return [{ [field]: Number(searchTerm) } as FilterQuery<T>]
        }
        if (type === 'string') {
          return [
            {
              [field]: { $regex: searchTerm, $options: 'i' },
            } as FilterQuery<T>,
          ]
        }
        return []
      },
    )

    if (conditions.length) {
      this.modelQuery = this.modelQuery.find({ $or: conditions })
    }

    return this
  }

  filter() {
    const queryObj = { ...this.query } // copy

    // Filtering
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields']

    excludeFields.forEach((el) => delete queryObj[el])

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>)

    return this
  }

  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt'
    this.modelQuery = this.modelQuery.sort(sort as string)

    return this
  }

  paginate() {
    const page = Number(this?.query?.page) || 1
    const limit = Number(this?.query?.limit) || 10
    const skip = (page - 1) * limit

    this.modelQuery = this.modelQuery.skip(skip).limit(limit)

    return this
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v'

    this.modelQuery = this.modelQuery.select(fields)
    return this
  }
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter()
    const total = await this.modelQuery.model.countDocuments(totalQueries)
    const page = Number(this?.query?.page) || 1
    const limit = Number(this?.query?.limit) || 10
    const totalPage = Math.ceil(total / limit)

    return {
      page,
      limit,
      total,
      totalPage,
    }
  }
}

export default QueryBuilder
