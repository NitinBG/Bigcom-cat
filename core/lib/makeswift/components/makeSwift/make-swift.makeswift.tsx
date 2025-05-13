import { runtime } from "~/lib/makeswift/runtime";
 
import { MakeSwift } from "~/components/make-swift";
 
runtime.registerComponent(MakeSwift, {
  type: "hello-makeswift",
  label: "Basic / Hello makeswift",
});