package com.a105.alub.domain.specs;

import com.a105.alub.domain.entity.User;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecs {

  public enum SearchKey {
    NAME("name");

    private final String value;

    SearchKey(String value) {
      this.value = value;
    }

    public String getValue() {
      return value;
    }
  }

  public static Specification<User> searchWith(Map<SearchKey, Object> searchKeyword) {
    return ((root, query, builder) -> {
      List<Predicate> predicate = getPredicateWithKeyword(searchKeyword, root, builder);
      return builder.and(predicate.toArray(new Predicate[0]));
    });
  }

  private static List<Predicate> getPredicateWithKeyword(Map<SearchKey, Object> searchKeyword,
      Root<User> root, CriteriaBuilder builder) {
    List<Predicate> predicate = new ArrayList<>();
    for (SearchKey key : searchKeyword.keySet()) {
      switch (key) {
        case NAME:
          predicate.add(builder.like(root.get(key.value),
              "%" + searchKeyword.get(key) + "%"));
          break;
        default:
          break;
//        case TAG:
//          predicate.add(builder.like(
//              root.get(key.value), searchKeyword.get(key)
//          ));
//          break;
//        case LIKESGREATERTHAN:
//          predicate.add(builder.greaterThan(
//              root.get(key.value), Integer.valueOf(searchKeyword.get(key).toString())
//          ));
//          break;
      }
    }
    return predicate;
  }
}
