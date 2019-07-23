export const toBeCloseToBytes = (received, argument) => {
  // console.log(received);
  const pass = received.length === argument.length;
  if (!pass) {
    return {
      message: () =>
        `expected ${JSON.stringify(received)} to be the same length as ${JSON.stringify(
          argument
        )}`,
      pass
    };
  }
  received.forEach((vector, index) => {
    expect(vector.length).toEqual(argument[index].length);
  });
  return {
    message: () =>
      `expected ${JSON.stringify(received)} to be close to matrix ${JSON.stringify(argument)}`,
    pass
  };
}
