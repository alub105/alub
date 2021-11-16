package com.a105.alub.domain.enums;

public enum BojLevel implements ProblemLevel {
  unrated, 
  bronze5, 
  bronze4,
  bronze3,
  bronze2,
  bronze1,
  silver5,
  silver4,
  silver3,
  silver2,
  silver1,
  gold5,
  gold4,
  gold3,
  gold2,
  gold1,
  platinum5,
  platinum4,
  platinum3,
  platinum2,
  platinum1,
  diamond5,
  diamond4,
  diamond3,
  diamond2,
  diamond1,
  ruby5,
  ruby4,
  ruby3,
  ruby2,
  ruby1;

  @Override
  public String getName() {
    return this.name();
  }

  public static boolean hasName(String name) {
    try {
      BojLevel.valueOf(name);
      return true;
    } catch (IllegalArgumentException e) {
      return false;
    }
  }
}
