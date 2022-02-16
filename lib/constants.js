export const monthList = [
  { id: 1, name: 'январь' },
  { id: 2, name: 'Февраль ' },
  { id: 3, name: 'Март ' },
  { id: 4, name: 'Апрель ' },
  { id: 5, name: 'Май ' },
  { id: 6, name: 'Июнь ' },
  { id: 7, name: 'Июль ' },
  { id: 8, name: 'Август ' },
  { id: 9, name: 'Сентябрь ' },
  { id: 10, name: 'Октябрь ' },
  { id: 11, name: 'Ноябрь ' },
  { id: 12, name: 'Декабрь ' },
];

//Это константы, которые описывают типы транзакций. У тас только 2 типа: расход и доход
export const EXPENSE = 'expense';
export const INCOME = 'income';

export const LIMIT_JSON = 5000;

export const HttpCode = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const categoryOfTransaction = [
  'transport',
  'food',
  'health',
  'alcohol',
  'entertainment',
  'housing',
  'technics',
  'communal',
  'sport',
  'education',
  'other',
  'salary',
  'additionalIncome',
];
