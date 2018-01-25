package de.tum.atse.ats.Utils.ObjectifyUtils;

import java.util.List;

public interface DatabaseInterface<T, S> {
    T findById(S id);
    void deleteById(S id);
    List<T> findAll();
    long count();
    T save(T newUser);
}

