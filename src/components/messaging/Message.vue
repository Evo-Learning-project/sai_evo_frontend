<template>
	<div class="flex items-center w-full my-3 space-x-2">
		<Avatar class="my-auto" :user="user" />
		<div class="w-full">
			<div class="flex items-center space-x-1">
				<p class="mr-2 font-medium text-primary capitalize">
					{{ user.full_name ?? "" }}
				</p>
				<Timestamp
					:value="created"
					:reduced="true"
					class="text-muted text-xs opacity-90"
				/>
			</div>
			<div class="flex w-full items-center">
				<p class="break-normal">{{ message }}</p>
			</div>
		</div>
		<Btn
			:variant="'icon'"
			:outline="true"
			@click="$emit('deleteMessage')"
			v-if="canDelete"
			class="
				ml-auto
				opacity-30
				hover:opacity-100
				transition-opacity
				duration-75
				ease-in-out
			"
		>
			<span class="material-icons text-muted">delete</span>
		</Btn>
	</div>
</template>

<script lang="ts">
import { User } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Avatar from "../ui/Avatar.vue";
import Btn from "../ui/Btn.vue";
import Timestamp from "../ui/Timestamp.vue";
export default defineComponent({
	name: "Message",
	props: {
		message: {
			type: String,
			required: true,
		},
		user: {
			type: Object as PropType<User>,
			required: true,
		},
		created: {
			type: String,
			required: true,
		},
		canDelete: {
			type: Boolean,
			required: true,
		},
	},
	emits: {
		deleteMessage() {
			return true;
		},
	},
	methods: {},
	computed: {},
	components: { Avatar, Timestamp, Btn },
});
</script>

<style></style>
