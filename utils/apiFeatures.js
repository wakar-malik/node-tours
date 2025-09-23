class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filterDuplicateParams(filterQueryStr) {
    const str = Array.isArray(filterQueryStr)
      ? filterQueryStr[0]
      : filterQueryStr;

    return str.split(",").join(" ");
  }

  filter() {
    const excludedFields = ["page", "limit", "sort", "fields"];
    const queryObj = { ...this.queryStr };
    excludedFields.forEach((field) => delete queryObj[field]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = JSON.parse(
      queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)
    );

    this.query = this.query.find(queryStr);

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.filterDuplicateParams(this.queryStr.sort);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.filterDuplicateParams(this.queryStr.fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const pageNum = Array.isArray(this.queryStr.page)
      ? this.queryStr.page[0] * 1
      : this.queryStr.page * 1;
    const limitNum = Array.isArray(this.queryStr.limit)
      ? this.queryStr.limit[0] * 1
      : this.queryStr.limit * 1;

    const page = pageNum || 1;
    const limit = limitNum || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
