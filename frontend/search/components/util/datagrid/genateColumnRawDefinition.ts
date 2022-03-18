/**
 * you can generate an inital raw column json by running the following
 * function
 */
const makeColumnDefinition = (data: any) =>
  Object.keys(data).map((k) => ({
    name: k,
    header: k.replace(/_/g, " "),
    type: typeof data[k],
  }));

export default makeColumnDefinition;
