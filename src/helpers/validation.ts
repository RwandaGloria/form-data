import out from './out';

export default (schema: any, toValidate: any, res: any, next: any) => {
  const { error } = schema.validate(toValidate);
  if (error) {
    console.log(`============== ${error} ===============`)
  }
  return error
    ? out(res, 422, undefined, 'Validation error', error.details[0].message.replace('/', '')
      .replace(/"/g, ''))
    : next();
};
