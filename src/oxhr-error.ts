export {OxhrError};

class OxhrError extends Error
{
  constructor(message?: string)
  {
    super(message);
    this.name = 'OxhrError';
  }
}
