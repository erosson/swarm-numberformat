import numberformat from '../../src/workspace';

describe('numberformat', () => {
  describe('Greet function', () => {
    beforeEach(() => {
      spy(numberformat, 'greet');
      numberformat.greet();
    });

    it('should have been run once', () => {
      expect(numberformat.greet).to.have.been.calledOnce;
    });

    it('should have always returned hello', () => {
      expect(numberformat.greet).to.have.always.returned('hello');
    });
  });
});
