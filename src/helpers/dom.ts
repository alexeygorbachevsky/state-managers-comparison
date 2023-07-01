interface GetIsTargetContainsExcludedClass {
  target: HTMLElement;
  currentTarget: HTMLElement;
  excludedClass: string;
}

const getIsTargetContainsExcludedClass = ({
  target,
  currentTarget,
  excludedClass,
}: GetIsTargetContainsExcludedClass): boolean => {
  if (!target.classList.contains(excludedClass)) {
    if (target === currentTarget) {
      return false;
    }

    if (target.parentElement) {
      return getIsTargetContainsExcludedClass({
        target: target.parentElement,
        currentTarget,
        excludedClass,
      });
    }
  }

  return true;
};

export const getIsTargetContainsExcludedClasses = ({
  target,
  currentTarget,
  excludedClasses,
}: Omit<GetIsTargetContainsExcludedClass, "excludedClass"> & {
  excludedClasses: GetIsTargetContainsExcludedClass["excludedClass"][];
}) => {
  let isContains = false;

  excludedClasses.forEach(excludedClassName => {
    const isContainsExcludedClass = getIsTargetContainsExcludedClass({
      target,
      currentTarget,
      excludedClass: excludedClassName,
    });
    if (isContainsExcludedClass) {
      isContains = true;

      return;
    }
  });

  return isContains;
};
