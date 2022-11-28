describe('createEpoch', () => {
  test.todo('errors when an overlapping epoch exists');
  describe('custom input', () => {
    test.todo('can create repeating weekly epochs with gaps');
    test.todo('can create repeating weekly epochs without gaps');
    test.todo('can create repeating monthly epochs with gaps');
    test.todo('can create repeating monthly epochs without gaps');
    test.todo(
      'cannot repeat with a frequency that is shorter than the duration'
    );
    test.todo('errors on malformed input');
  });
  describe('monthly input', () => {
    test.todo('errors on malformed input');
    test.todo(
      'creates a new epoch on the correct day of the correct week of the month'
    );
    test.todo('handles cases at the end of the month correctly');
    test.todo(
      'always extends the epoch to end on the start date of the following month'
    );
  });
});
