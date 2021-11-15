package com.a105.alub.domain.enums;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import java.io.IOException;

public class ProblemLevelDeserializer extends StdDeserializer<ProblemLevel> {

  protected ProblemLevelDeserializer() {
    super(ProblemLevel.class);
  }

  @Override
  public ProblemLevel deserialize(JsonParser p, DeserializationContext ctxt)
      throws JsonProcessingException, IOException {
    String str = p.getText();
    return BojLevel.valueOf(str);
  }
}
