import { ForwardedRef, forwardRef, useMemo } from 'react';
import ReactSelect, { GroupBase, Props } from 'react-select';
import ReactSelectType from 'react-select/base';

import { SelectBaseSize } from './selectBaseType';
import { getStyles } from './style';

export interface SelectBaseProps<
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
> extends Props<Option, IsMulti, Group> {
  size?: SelectBaseSize;
  error?: string | boolean;
}

/* eslint-disable no-unused-vars */
type SelectBaseType = <
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: SelectBaseProps<Option, IsMulti, Group> & {
    ref?: ForwardedRef<ReactSelectType<Option, IsMulti, Group>>;
  },
) => JSX.Element;
/* eslint-enable no-unused-vars */

export const SelectBase = forwardRef(
  <
    Option = unknown,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>,
  >(
    { size = 'md', error, className, ...props }: SelectBaseProps<Option, IsMulti, Group>,
    ref: ForwardedRef<ReactSelectType<Option, IsMulti, Group>>,
  ) => {
    const hasError = typeof error === 'string' || !!error;

    const styles = useMemo(
      () => getStyles<Option, IsMulti, Group>({ size, hasError }),
      [hasError, size],
    );

    return (
      <ReactSelect
        placeholder=""
        className={className}
        components={{
          IndicatorSeparator: null,
        }}
        styles={styles}
        ref={ref}
        {...props}
      />
    );
  },
) as SelectBaseType;
