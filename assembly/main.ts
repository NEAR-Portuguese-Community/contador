import { storage } from "near-sdk-as";

export function increment(): i32 {
  const newVal = storage.getPrimitive<i32>("counter", 0) + 1;
  storage.set<i32>("counter", newVal);
  return newVal;
}

export function decrement(): i32 {
  const newVal = storage.getPrimitive<i32>("counter", 0) - 1;
  storage.set<i32>("counter", newVal);
  return newVal;
}

export function getCounter(): i32 {
  return storage.getPrimitive<i32>("counter", 0);
}