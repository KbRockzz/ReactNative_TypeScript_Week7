
import React from "react";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { TabBar, type TabItem } from "../components/TabBar";
import { useCart } from "../store/hooks";

// Emoji tương ứng với từng tab.
const EMOJI: Record<string, string> = {
  Home: "🏠",
  Categories: "🗂️",
  Cart: "🛒",
  Account: "👤",
};

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { totalQuantity } = useCart();
  // Chuyển danh sách route thành dữ liệu để TabBar hiển thị.
  const items: TabItem[] = state.routes.map((route) => ({
    key: route.key,
    label: descriptors[route.key].options.title ?? route.name,
    emoji: EMOJI[route.name] ?? "•",
    badge: route.name === "Cart" ? totalQuantity : 0,
  }));


  // Xử lý khi người dùng bấm vào một tab.
  const onPress = (key: string) => {
    const route = state.routes.find((item) => item.key === key);

    if (!route) {
      return;
    }

    const isFocused = state.routes[state.index].key === key;

    // Phát sự kiện tabPress trước khi chuyển màn hình.
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    // Chỉ chuyển màn nếu tab chưa được chọn và sự kiện không bị chặn.
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  return (
    <TabBar
      items={items}
      activeKey={state.routes[state.index].key}
      onPress={onPress}
    />
  );
}
