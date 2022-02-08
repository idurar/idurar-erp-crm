import * as React from 'react';
import { render, screen, act, cleanup } from '@testing-library/react';

import { Provider } from 'react-redux';

import store from '@/redux/store';
import { CrudContextProvider } from '@/context/crud';

import ReadItem from './index';
import FeedStoreMock from '@/test/mocksComponent/FeedStoreMock';
import { crud } from '@/redux/crud/actions';

const data = {
  company: 'IDURAR',
  managerSurname: 'Lalami ',
  managerName: 'Salah Eddine',
  email: 'idurardz@gmail.com',
  phone: '05541 144 700',
};

const readColumns = [
  {
    title: 'Company',
    dataIndex: 'company',
  },
  {
    title: 'Manager Surname',
    dataIndex: 'managerSurname',
  },
  {
    title: 'Manager Name',
    dataIndex: 'managerName',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
  },
];

const config = { readColumns };

const RenderedComponent = () => {
  return (
    <Provider store={store}>
      <FeedStoreMock method={crud.currentItem} data={data} />
      <CrudContextProvider>
        <ReadItem config={config} />
      </CrudContextProvider>
    </Provider>
  );
};

// describe('Integration Testing : Read Component', () => {
//   test('renders read component', () => {
//     // const { debug } = render(<RenderedComponent />);
//     // // eslint-disable-next-line testing-library/no-debugging-utils
//     // act(() => debug());

//     render(<RenderedComponent />);

//     // eslint-disable-next-line jest/valid-expect
//     expect(screen.getByText('Lalami'));
//     // eslint-disable-next-line jest/valid-expect
//   });
// });

describe('Integration Testing : Read Component', () => {
  afterEach(() => cleanup());

  test('should contain `managerSurname` text', (text = data.managerSurname) => {
    render(<RenderedComponent />);

    // eslint-disable-next-line jest/valid-expect
    expect(screen.getByText('Lalami'));
  });
  test('should contain `Company Label` text', (text = readColumns[0].title) => {
    render(<RenderedComponent />);
    // eslint-disable-next-line jest/valid-expect
    expect(screen.getByText(text));
  });
  test('should contain `Company Name` text', (text = data.company) => {
    render(<RenderedComponent />);
    // eslint-disable-next-line jest/valid-expect
    expect(screen.getByText(text));
  });
  // test('renders read component', () => {
  //   // const { debug } = render(<RenderedComponent />);
  //   // // eslint-disable-next-line testing-library/no-debugging-utils
  //   // act(() => debug());

  // });
});
