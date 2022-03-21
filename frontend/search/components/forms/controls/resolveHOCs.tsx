import React, {ComponentType, useCallback} from 'react'
import {
  ArrayLayoutProps,
  composeWithUi,
  getData,
  OwnPropsOfControl,
  Resolve} from "@jsonforms/core";
import {
  ctxDispatchToArrayControlProps,
  ctxToArrayLayoutProps,
  JsonFormsStateContext,
  withJsonFormsContext
} from "@jsonforms/react";

type ArrayDataProp = {
  arrayData: any[]
}
export type CustomArrayLayoutProps = ArrayLayoutProps & ArrayDataProp

const withContextToArrayLayoutProps =
  (Component: ComponentType<CustomArrayLayoutProps>): ComponentType<CustomArrayLayoutProps> => {
    const component = ({ctx, props}: JsonFormsStateContext & ArrayLayoutProps) => {
      const arrayLayoutProps = ctxToArrayLayoutProps(ctx, props);
      const rootData = getData({jsonforms: ctx});
      const path = composeWithUi(props.uischema, props.path);
      const data = Resolve.data(rootData, path);
      const dispatchProps = ctxDispatchToArrayControlProps(ctx.dispatch);
      return (<Component {...arrayLayoutProps} {...dispatchProps} arrayData={data}/>);
    };
    return component
  };

export const withJsonFormsArrayLayoutProps =
  (Component: ComponentType<CustomArrayLayoutProps>, memoize = true): ComponentType<OwnPropsOfControl> =>
    withJsonFormsContext(
      withContextToArrayLayoutProps(memoize ? React.memo(Component) : Component));
