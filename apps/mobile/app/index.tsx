import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { ActivityIndicator, View } from "react-native";
import { SignInScreen } from "@/components/SignInScreen";
import { FeedScreen } from "@/components/FeedScreen";

export default function Index() {
  return (
    <>
      <AuthLoading>
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" />
        </View>
      </AuthLoading>
      <Unauthenticated>
        <SignInScreen />
      </Unauthenticated>
      <Authenticated>
        <FeedScreen />
      </Authenticated>
    </>
  );
}
