export default {
  name: 'serviceExample',
  data() {
    return {
      activeName: 'first',
      tableDate: [
        {
          key: 'asdas',
          value: 'asfas',
        },
        {
          key: 'asdas',
          value: 'asfas',
        },
        {
          key: 'asdas',
          value: 'asfas',
        },
      ],
      currentStep: '1-1',
      jobs: [
        {
          owner: [
            {
              name: 'b',
            },
          ],
          started_at: '233',
        },
        {
          owner: [
            {
              name: 'b',
            },
          ],
          started_at: '333',
        },
      ],
      tableData: [
        {
          resourceName: 'ngnix-example-1',
          type: 'Deployment',
          state: 'Created',
          date: '2020-5-23 15:12:45',
        },
        {
          resourceName: 'ngnix-example-1',
          type: 'Deployment',
          state: 'Created',
          date: '2020-5-23 15:12:45',
        },
      ],
    };
  },
  methods: {
    toDetail() {
      this.activeName = 'second';
    },
  },
};
