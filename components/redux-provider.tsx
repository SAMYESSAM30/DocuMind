"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchUser } from "@/lib/slices/authSlice";
import { setNavigationLoading } from "@/lib/slices/uiSlice";
import { PageLoader } from "@/components/loader";

function NavigationLoader() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { navigationLoading } = useAppSelector((state) => state.ui);

  useEffect(() => {
    // Set navigation loading when pathname changes
    dispatch(setNavigationLoading(true));
    const timer = setTimeout(() => {
      dispatch(setNavigationLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, dispatch]);

  if (navigationLoading) {
    return <PageLoader message="Loading page..." />;
  }

  return null;
}

function ReduxProviderInner({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Fetch user on mount
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <>
      {children}
      <NavigationLoader />
    </>
  );
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ReduxProviderInner>{children}</ReduxProviderInner>
    </Provider>
  );
}

