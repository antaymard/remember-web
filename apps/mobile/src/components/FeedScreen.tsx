import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@remember/backend/api";

// The exact return type of the shared Convex query, pulled through the
// @remember/backend package — the same `api` the web app and the Convex
// functions use. One source of truth across web + native is the whole point of
// the monorepo. (moments.list augments each moment with `creator` and resolved
// `present_persons`, so we derive the type from the query rather than Doc.)
type Moment = FunctionReturnType<typeof api.moments.list>[number];

function MomentRow({ moment }: { moment: Moment }) {
  const cover = moment.medias?.[0]?.url;
  return (
    <View className="mx-4 mb-3 rounded-2xl overflow-hidden bg-gray-100">
      {cover ? (
        <Image
          source={{ uri: cover }}
          className="w-full h-56"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-56 items-center justify-center">
          <Text className="text-gray-400">Pas de photo</Text>
        </View>
      )}
      <View className="p-4">
        <Text className="text-lg font-semibold text-gray-900">
          {moment.title}
        </Text>
        {moment.description ? (
          <Text className="text-gray-500 mt-1" numberOfLines={2}>
            {moment.description}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export function FeedScreen() {
  const { signOut } = useAuthActions();
  // Same query the web feed uses, fully typed from the shared backend package.
  const moments = useQuery(api.moments.list);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">Feed</Text>
        <Pressable
          onPress={() => signOut()}
          className="px-3 py-1.5 rounded-lg bg-gray-100 active:opacity-70"
        >
          <Text className="text-gray-700">Déconnexion</Text>
        </Pressable>
      </View>

      {moments === undefined ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : moments.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-gray-400 text-center">
            Aucun souvenir pour l'instant. Crée-en depuis l'app web !
          </Text>
        </View>
      ) : (
        <FlatList
          data={moments}
          keyExtractor={(m) => m._id}
          renderItem={({ item }) => <MomentRow moment={item} />}
          contentContainerStyle={{ paddingVertical: 12 }}
        />
      )}
    </SafeAreaView>
  );
}
