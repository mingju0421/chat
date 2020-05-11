import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
const ChatPage = () =>
  import(/* webpackChunkName: "ChatPage" */ "../views/chatPage/chatPage.vue");
const Login = () =>
  import(/* webpackChunkName: "Login" */ "../views/login/login.vue");

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "/chatPage",
    name: "ChatPage",
    component: ChatPage
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
