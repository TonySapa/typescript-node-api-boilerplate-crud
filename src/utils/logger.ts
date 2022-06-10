// Used to factorise console log

export const info = (...params: Array<unknown>): void => {
  if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
  }
}

export const error = (...params: Array<string>): void => {
  if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
  }
}

export const log = (...params: Array<unknown>): void => {
  if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
  }
}
